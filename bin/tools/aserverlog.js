module.exports=()=>{
    return{
        timein:new Date().getTime(),
        timecheck:new Date().getTime(),
        timeout:null,
        msg:this.pak.msg,
        info:this.info,
        track:[]
    }
};