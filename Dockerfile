FROM node:16.16.0

WORKDIR /app

COPY package*.json ./

RUN npm install

# Linux x64
# ENV CONDA_PLATFORM=Miniconda3-latest-Linux-x86_64.sh
# Linux ARM64
ENV CONDA_PLATFORM=Miniconda3-latest-Linux-aarch64.sh

RUN wget https://repo.anaconda.com/miniconda/${CONDA_PLATFORM} && \
    bash ${CONDA_PLATFORM} -b -p /opt/conda && \
    rm ${CONDA_PLATFORM}

ENV PATH /opt/conda/bin:$PATH

RUN conda install -y mysql-connector-python
RUN conda install -y pandas
RUN conda install -y matplotlib
RUN conda install -y seaborn

COPY . .

CMD ["npm", "start"]
