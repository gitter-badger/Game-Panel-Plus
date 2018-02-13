# Download MTA Server
cd "%wd", CDMODE.CREATE
download "https://linux.mtasa.com/dl/multitheftauto_linux_x64.tar.gz", "server.tar.gz"
tar "server.tar.gz"
mv "multitheftauto_linux_x64/*", "."
rmdir "multitheftauto_linux_x64"
rm "server.tar.gz"
# Download MTA Server Config
cd "mods/deathmatch", CDMODE.CREATE
download "https://linux.mtasa.com/dl/baseconfig.tar.gz", "config.tar.gz"
tar "config.tar.gz"
mv "baseconfig/*", "."
rmdir "baseconfig"
rm "config.tar.gz"
# Download Default Resources
mkdir "resources"
if Options.InstallResources
    cd "resources"
    download "http://mirror.mtasa.com/mtasa/resources/mtasa-resources-latest.zip", "resources.zip"
    unzip "resources.zip"
    rm "resources.zip"