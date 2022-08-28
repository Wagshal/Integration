FROM node:alpine
ADD https://netfree.link/dl/unix-ca.sh /home/netfree-unix-ca.sh 
RUN cat  /home/netfree-unix-ca.sh | sh
ENV NODE_EXTRA_CA_CERTS=/etc/ca-bundle.crt
ENV REQUESTS_CA_BUNDLE=/etc/ca-bundle.crt
ENV SSL_CERT_FILE=/etc/ca-bundle.crt
WORKDIR /client
COPY package.json ./
RUN npm i
COPY ./ ./
RUN npm install @material-ui/core 
# --legacy-peer-deps
RUN npm install @mui/material @emotion/react @emotion/styled
#  --legacy-peer-deps
RUN npm install @mui/icons-material 
# --legacy-peer-deps
EXPOSE 3000 
CMD ["npm", "start"]