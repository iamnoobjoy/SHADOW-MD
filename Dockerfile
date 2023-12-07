FROM quay.io/shadowmd/shadow:latest
RUN git clone https://github.com/inrl-official/inrl-bot-md /root/shadow
WORKDIR /root/shadow/
RUN yarn install --network-concurrency 1
EXPOSE 8000
CMD ["npm", "start"]
