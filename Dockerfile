FROM node:16.16.0

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh && \
    bash Miniconda3-latest-Linux-aarch64.sh -b -p /opt/conda && \
    rm Miniconda3-latest-Linux-aarch64.sh

ENV PATH /opt/conda/bin:$PATH

RUN conda install -y mysql-connector-python
RUN conda install -y pandas
RUN conda install -y matplotlib
RUN conda install -y seaborn

COPY . .

CMD ["npm", "start"]
