In this project, we will need a local database to test our javascript application against. To do this, we will use docker to run a Postgres server in a container.

- **Watch** [📺 Docker in 5 minutes](https://www.youtube.com/watch?v=_dfLOzuIg2o)

## Installing Docker

:exclamation: It's likely you've followed a lot of these steps in a previous project. We've replicated them here just in case you are coming back to this track after some time, or are on a different computer than when you first did this.

Feel free to skip steps like installing Docker or MySQL-Workbench if you have already done them.

### Ubuntu

Update your software database:

```
sudo apt update
```

Remove any old versions of docker that might be on your system:

```
sudo apt remove docker docker-engine docker.io
```

Install docker:

```
sudo apt install docker.io
```

Check docker version:

```
docker --version
```

### Windows and Mac

Docker can be easily installed on Windows and Mac with [Docker Desktop](https://docs.docker.com/get-docker/).

You will need to make sure Docker Desktop is running in order to use docker commands in your terminal.

You can check that your docker installation is working with:

```
docker run hello-world
```

If successful you should see something like: 

```
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
2db29710123e: Pull complete
Digest: sha256:e18f0a777aefabe047a671ab3ec3eed05414477c951ab1a6f352a06974245fe7
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```

### Creating the Database Container

Once you have docker installed, you can pull and run a postgres image with:

```
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres
```

### Install pgAdmin4

For this challenge we will be using pgAdmin4. 
Regardless of your operating system, you should be able to download the client from or find instructions to do so from https://www.pgadmin.org/download/.

If you're a Linux user you may install the client by running the following commands from the [official guide](https://www.pgadmin.org/download/pgadmin-4-apt):

```
# Install the public key for the repository:
curl -fsS https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo gpg --dearmor -o /usr/share/keyrings/packages-pgadmin-org.gpg

# Create the repository configuration file:
sudo sh -c 'echo "deb [signed-by=/usr/share/keyrings/packages-pgadmin-org.gpg] https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'

#
# Install pgAdmin
#

# Install for both desktop and web modes:
sudo apt install pgadmin4
```

### Finally

When you run pgAdmin, You should see a `Add New Server` button. Click it and use the following credentials to connect:

- Hostname/address: `localhost`
- User: `postgres`
- Password: `password`

You will also give your server a name. Something like `local-postgres` will do.

When you are able to connect to your postgres container, you are ready to move on. 

If the instructions above don't work, after double checking the instructions, reach out for help :)
