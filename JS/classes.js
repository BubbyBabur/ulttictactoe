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

class ToggleButtons {
    constructor(toggleobj,id1,id2){

        this.id1 = id1;
        this.id2 = id2;

        this.toggleobj = toggleobj;

        $( () => {
            $(id1).hover(() => {
                if (this.toggleobj.value) {
                    this.switch(0,"hover");
                }
            }, () => {
                if (this.toggleobj.value) {
                    this.switch(0, "standard");
                }
            })

            $(id1).mousedown(() => {
                if (this.toggleobj.value) {
                    this.switch(0, "pressed");
                }
            })

            $(id1).mouseup(() => {
                if (this.toggleobj.value) {
                    this.switch(0, "standard");
                }
            })

            $(id1).click(() => {
                this.toggleobj.value = false;
                this.switch(0, "pressed");
                this.switch(1, "standard");
            })

            $(id2).hover(() => {
                if (!this.toggleobj.value) {
                    this.switch(1, "hover");
                }
            }, () => {
                if (!this.toggleobj.value) {
                    this.switch(1, "standard");
                }
            })

            $(id2).mousedown(() => {
                if (!this.toggleobj.value) {
                    this.switch(1, "pressed");
                }
            })

            $(id2).mouseup(() => {
                if (!this.toggleobj.value) {
                    this.switch(1, "standard");
                }
            })

            $(id2).click(() => {
                this.toggleobj.value = true;
                this.switch(1, "pressed");
                this.switch(0, "standard");
            })
        });
    }

    switch(num,state){
        if(num == 0){
            $(this.id1).removeClass("pressed-paired-1-button standard-paired-1-button hover-paired-1-button")
                .addClass(state + "-paired-" + (num+1) + "-button");
        } else {
            $(this.id2).removeClass("pressed-paired-2-button standard-paired-2-button hover-paired-2-button")
                .addClass(state + "-paired-" + (num+1) + "-button");
        }
    }

}

class configJQueryButtonClass{
    constructor(classname){

        this.classname = classname;

        let _this = this;
        $("." + classname).hover(function () {
            _this.switch(this,"hover");
        }, function () {
            _this.switch(this, "standard");
        })

        $("." + classname).mousedown(function () {
            _this.switch(this, "pressed");
        })
        $("." + classname).mouseup(function () {
            _this.switch(this, "hover");
        })

    }
    
    switch(obj, state){
        $(obj).removeClass("pressed-" + this.classname + " standard-" + this.classname + " hover-" + this.classname)
            .addClass(state + "-" + this.classname);
    }
}

