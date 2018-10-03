sslemail=s@projectoblio.com
domain=testdubs.projectoblio.com
apt-get update; 
sudo add-apt-repository ppa:certbot/certbot -y;

apt-get upgrade -y; 
sudo apt-get install certbot -y; 
sudo certbot --force-renewal certonly --standalone --agree-tos --email $sslemail -w ./ -d $domain;
cp /etc/letsencrypt/live/$domain/* ./; 
certbot renew --dry-run

