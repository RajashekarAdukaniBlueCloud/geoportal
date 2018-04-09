export const last_termination:any = {
    "cion" : function(word: string){
        return word.replace("cion", "ción");
    },
    "sion" : function(word: string){
        return word.replace("sion", "sión");
    }
};