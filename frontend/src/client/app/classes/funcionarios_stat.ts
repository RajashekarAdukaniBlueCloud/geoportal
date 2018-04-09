import { FuncionarioArea } from './funcionarioarea';

export class FuncionarioStatSiaper{
    public TIPOCALIDAD: string;
    public CODIGOCALIDAD: number;
    public AREAS: FuncionarioArea[];
    private _areas: any;
    public TOTAL: number;
    public GROUPBYAREA: boolean;
    /* constructor de la clase */
    constructor(data:any = null){
        this.AREAS = [];
        if(data == null){
            this.TOTAL = 0;
            return this;
        }
        this.TIPOCALIDAD = data.TIPOCALIDAD;
        this.CODIGOCALIDAD = data.CODIGOCALIDAD;
        this.TOTAL = data.TOTAL;
        this._areas = data.AREAS;
        this.GROUPBYAREA = data.GROUPBYAREA;
    }
    public getAreas():FuncionarioArea[]{
        if(this.AREAS.length > 0){
            return this.AREAS;
        }
        for(let key in this._areas){
            this.AREAS.push(new FuncionarioArea(this._areas[key]));
        }
        return this.AREAS;
    }
};
