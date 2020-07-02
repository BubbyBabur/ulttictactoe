class ImageWrapper {
    constructor(paths){
        this.images = {};
        for(let path of paths){
            this.images[path] = loadImage(path);
        }
    }

    getImage(path){
        return this.images[path];
    }
}