FROM 
RUN git clone https://github.com/JoyBoySer/SHADOW-MD /root/shadow
WORKDIR 
RUN yarn install --network-concurrency 1
EXPOSE 8000
CMD ["npm", "start"]
