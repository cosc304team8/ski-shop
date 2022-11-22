# COSC 304 Project Group 8

## ** PLEASE READ THIS FIRST **

_We converted the project to use MySQL since there we were having issues with Microsoft SQL Server on Apple Silicon._

Please use our `docker-compose` file as it contains the MySQL config data.

---

## Project Description

Ski/Snowboard Supply Shop written in Node.js

## Team Members

Zaynb Alkhafadi, Daniel Coward, Ahmad Daoud, and Connor Doman

## Installation Instructions

### Prerequisites

You will need to have `node` installed to run this project. You can install `node` by following the instructions [here](https://nodejs.org/en/download/).

You also need `git` installed. This is installed by default in Linux and macOS. For Windows, you can install it [here](https://git-scm.com/downloads).

### Setup

Open a terminal in the folder you'd like to download the project's folder into (e.g. `/Users/connordoman/school/304/`). Then run the following command:

```bash
git clone https://github.com/cosc304team8/ski-shop.git
```

(You may have to enter your GitHub username and password unless you have set up SSH keys.)

Then change the directory to this downloaded folder:

```bash
cd ski-shop
```

## Running the Project

This project deviates from the standard COSC 304 Lab 7 by using MySQL rather than Microsoft SQL Server. The `docker-compose.yml` file has been updated to use MySQL instead of MSSQL. You can run the project with the following command:

To run in the background:

```bash
docker-compose up -d
```

To see server output in the terminal:

```bash
docker-compose up
```

If you're having connection issues, delete existing docker containers and try these commands again.

## Working on the project

### Branches

When you work on a feature, you should use a different git branch.

This helps keep changes from snowballing out of control and makes it easier to merge changes into the `main` branch.

The easiest way to make a branch and start using it is to run:

```bash
git checkout -b <branch-name>
```

(To see what branch you're on, run `git status`. To switch branches, run `git checkout <branch-name>`, without "-b". To list all branches, run `git branch`.)

Then, when your changes are somewhat stable, commit them to the branch:

```bash
git add -A
git commit -m "Commit message"
```

Then, to upload your changes to GitHub, run the following command once:

```bash
git push -u origin <branch-name>
```

And then every time you want to push after that, you can just run:

```bash
git push
```

(You may have to enter your GitHub username and password unless you have set up SSH keys.)

### Merging Changes

When you're ready to merge your changes into the `main` branch, you should [create a pull request](https://github.com/cosc304team8/ski-shop/pulls). This can be done by going to the GitHub page for the project and clicking the "New pull request" button. You can then select the branch you want to merge into `main` and create the pull request.
