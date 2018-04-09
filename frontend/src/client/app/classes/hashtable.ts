export class HashTable<T,L>{
    private table:any;
    private id:string;
    constructor(id:string = null, reload:boolean = false){
        this.table = {};
        this.id = id;
        if(this.id && reload) this.loadFromMemory();
    }
    public put(key:T, value:L){
        this.table['v_'+key] = value;
        return this;
    }
    public get(key:T){
        return this.table['v_'+key];
    }
    public getAll(){
        let vector = [];
        for(let key in this.table){
            vector.push(this.table[key]);
        }
        return vector;
    }
    public has(key:T){
        if(typeof this.table['v_'+key] != "undefined") return true;
        return false;
    }
    public remove(key:T){
        delete this.table['v_'+key];
    }
    public putArray(key:T, value:L){
        if(typeof this.table['a_'+key] == "undefined") this.table['a_'+key] = [];
        this.table['a_'+key].push(value);
        return this;
    }
    public getArray(key:T){
        if(typeof this.table['a_'+key] == "undefined") this.table['a_'+key] = [];
        return this.table['a_'+key];
    }
    public removeArray(key:T, value:L){
        if(typeof this.table['a_'+key] != "undefined"){
            this.table['a_'+key].splice(this.table['a_'+key].indexOf(value),1);
        }
    }
    public hasArray(key:T){
        if(typeof this.table['a_'+key] != "undefined"){
            return true;
        }
        else
        {
            return false;
        }
    }
    public hasinArray(key:T, value:L){
        if(typeof this.table['a_'+key] != "undefined"){
            if(this.table['a_'+key].indexOf(value) != -1) return true;
            return false;
        }
        else
        {
            return false;
        }
    }
    public forEach(callback: any){
        for(let key in this.table){
            callback(key.substring(2),this.table[key]);
        }
    }
    public saveToMemory(){
        // localStorage.setItem(this.id, JSON.stringify(this.table, function replacer(key, value) {
        //     try{
        //         JSON.stringify(value);
        //         return value;
        //     } catch(e){
        //         return false;
        //     }
        // }));
    }
    private loadFromMemory(){
        //if(localStorage.getItem(this.id)) this.table = localStorage.getItem(this.id);
    }
}