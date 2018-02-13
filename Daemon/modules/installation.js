const CoffeeScript = require('coffeescript');
const fs = require('fs');
const shell = require('shelljs');
const http = require('http');
const https = require('https');
const path = require('path');
const vm = require('vm');
const tar = require('tar');
const unzip = require('unzip');
const steamcmd = require('steamcmd');

// Helpers
var adapterFor = (function() {
    var url = require('url'),
      adapters = {
        'http:': require('http'),
        'https:': require('https'),
      };
  
    return function(inputUrl) {
      return adapters[url.parse(inputUrl).protocol]
    }
}());

class Installation {
    constructor(identifier, directory, options = {}){
        return new Promise((resolve, reject) => {
            const coffeeInstructions = fs.readFileSync(path.join(__dirname, "..", "installations", identifier.toUpperCase() + ".coffee"));

            this.resolve = () => resolve();
            this.reject = () => reject();

            this.WorkingDirectory = path.resolve(directory);
            this.CurrentDirectory = this.WorkingDirectory;
            this.Queue = [];
            this.Errors = [];
            this.VM = {
                cd: (...args) => this.queue(this.cd, args),
                mkdir: (...args) => this.queue(this.mkdir, args),
                download: (...args) => this.queue(this.download, args),
                tar: (...args) => this.queue(this.tar, args),
                mv: (...args) => this.queue(this.mv, args),
                rmdir: (...args) => this.queue(this.rmdir, args),
                rm: (...args) => this.queue(this.rm, args),
                unzip: (...args) => this.queue(this.unzip, args),
                steam: {
                    install: (...args) => this.queue(this.install, args),
                },
                Options: options,
                CDMODE: {
                    CREATE: 1
                }
            };
            this.Context = vm.createContext(this.VM);
            this.Script = new vm.Script(CoffeeScript.compile(coffeeInstructions.toString()));
            
            steamcmd.touch().then(() => {
                this.start();
            }).catch(() => {
                steamcmd.download().then(() => {
                    this.start();
                });
            });
        });
    }

    start(){
        this.Script.runInContext(this.Context);
        this.runQueue();
    }

    queue(func, args){
        this.Queue.push({Function: func, Args: args});
    }

    runQueue(){
        if(typeof(this.Queue[0]) != "undefined"){
            const data = this.Queue[0];
            //console.log(`${data.Function.name} =>`, data.Args);
            data.Function.apply(this, data.Args).then(() => {
                this.Queue.shift();
                this.runQueue();
            }).catch((err) => {
                console.error(err);
                this.Errors.push(err.message);
            });
        } else {
            this.resolve();
        }
    }

    // Script functions
    cd(p, cdmode){
        return new Promise((resolve, reject) => {
            let newDir = this.CurrentDirectory;
            if(p == "%wd"){
                newDir = this.WorkingDirectory;
            } else {
                newDir = path.join(this.CurrentDirectory, p);
            }
            if(cdmode != this.VM.CDMODE.CREATE){
                if(!fs.existsSync(newDir))
                    return reject(new Error("cd: path does not exist"));
                else
                    this.CurrentDirectory = newDir;
            }else{
                if(!fs.existsSync(newDir))
                    shell.mkdir("-p", newDir);
                this.CurrentDirectory = newDir;
            }
            resolve();
        });
    }
    mkdir(name){
        return new Promise((resolve, reject) => {
            shell.mkdir("-p", path.join(this.CurrentDirectory, name));
            resolve();
        });
    }
    download(url, filename){
        return new Promise((resolve, reject) => {
            const dest = path.join(this.CurrentDirectory, filename);
            const file = fs.createWriteStream(dest);
            const request = adapterFor(url).get(url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    file.close(resolve);
                });
            }).on('error', function(err) {
                fs.unlink(dest);
                reject(err.message);
            });
        });
    }
    tar(file){
        return new Promise((resolve, reject) => {
            tar.x({
                file: path.join(this.CurrentDirectory, file),
                C: this.CurrentDirectory
            }).then(resolve).catch(reject);
        });
    }
    mv(source, dest){
        return new Promise((resolve, reject) => {
            shell.mv(path.join(this.CurrentDirectory, source), (dest == "." ? this.CurrentDirectory : path.join(this.CurrentDirectory, dest)));
            resolve();
        });
    }
    rmdir(dir){
        return new Promise((resolve, reject) => {
            shell.rm("-R", path.join(this.CurrentDirectory, dir));
            resolve();
        });
    }
    rm(file){
        return new Promise((resolve, reject) => {
            shell.rm(path.join(this.CurrentDirectory, file));
            resolve();
        });
    }
    unzip(file){
        return new Promise((resolve, reject) => {
            const zip = unzip.Extract({ path: this.CurrentDirectory });
            zip.on("close", resolve);
            fs.createReadStream(path.join(this.CurrentDirectory, file)).pipe(zip);
        });
    }
    
    // Steamcmd API
    install(appId){
        return new Promise((resolve, reject) => {
            steamcmd.updateApp(appId, this.CurrentDirectory).then(resolve).catch(reject);
        });
    }
}

module.exports = Installation;