#

sudo apt-get install pigpio

rsync -av --info=progress2 --exclude 'node_modules' . pi@roongarage:rpi-thermostat/