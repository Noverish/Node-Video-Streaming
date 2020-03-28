# Node Video Streaming (Sample Project)

Sample project which streaming video using Node.js and HTML 5 Video Tag

## Demo

![main.gif](https://github.com/Noverish/Node-Video-Streaming/blob/master/readme/main.gif?raw=true)

## Try with Docker

1) Run docker container

```shell
$ docker run -d \
    -p 8080:80 \
    -v "/path/of/video/folder:/archive" \
    embrapers263/node-video-streaming
```

2) Access to `localhost:8080`

3) Enter password `123456789`

4) [Additional] Override `users.json` to your container if you want to manage users

```shell
$ docker run -d \
    -p 8080:80 \
    -v "/path/of/video/folder:/archive" \
    -v "/path/to/users.json:/app/assets/users.json" \
    embrapers263/node-video-streaming
```

## Feature

- Auto convert smi, srt subtitle file to vtt file
- User control through login with jwt
- Skip video for next of previous 10 seconds
- Access logging

## Used

- Typescript
- Video.js
- Express, ejs
- JSON Web Token

## Todo

- [ ] Logout
- [ ] Prevent brute force attack
