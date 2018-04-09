export class ChartDef {
    public labels:any =[];
    public datasets:any = [];
	public options:any;
	public indexColor: number = 0;
	// https://micgr.contraloria.cl/web/intranet-cgr/unidad-de-servicios-graficos
	public colorPalette: string[] = [
		"#E6332A",
		"#00A099",
		"#81358A",
		"#BBCE00",
		"#E3007E",
		"#76B72A",
		"#AE151E",
		"#0D69B3"
	];
	
  	constructor(){
  		this.datasets.push({
	        label: "",
	        data: [],
			backgroundColor: [],
			method: []
	    });
	    this.options = {
		    responsive: true,
		    maintainAspectRatio: false
		};
	  }
	  
  	public setElementColor(label:string,value:number,color:string){
  		this.labels.push(label);
  		this.datasets[0].data.push(value);
  		this.datasets[0].backgroundColor.push(color);
	}
	  
  	public setElement(label:string,value:number){
  		this.labels.push(label);
  		this.datasets[0].data.push(value);
  		this.datasets[0].backgroundColor.push(this.getRandomColor());
	}
	
  	public setLabels(labels:string[]){
		  this.labels = labels;
	}
	
  	public setValues(value:number[]){
  		this.datasets[0].data = value;
	}
	
  	public setColors(color:string[]){
  		this.datasets[0].backgroundColor = color;
	}
	
  	public getOptions(){
  		return this.options;
	}
	
  	public setOption(name:string, obj:any){
  		this.options[name] = obj;
	}
	
  	public getColorById(index:number){
  		return this.datasets[0].backgroundColor[index];
	}

  	private getRandomColor() {
		if(this.indexColor >= this.colorPalette.length) {
			this.indexColor = 0;
		}

		let color = this.colorPalette[this.indexColor];
		this.indexColor++;
	    return color;
	}

	public setRandomColors(){
		for(let i=0;i<this.labels.length;i++){
			this.datasets[0].backgroundColor.push(this.getRandomColor());
		}
	}
	
	public setmethods(methods: string[]) {
		this.datasets[0].method = methods;
	}

	public getMethodById(index: number){
		return this.datasets[0].method[index];
	}
}
