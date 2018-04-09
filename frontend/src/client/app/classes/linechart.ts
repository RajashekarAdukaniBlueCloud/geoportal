/*
* This class represents the class definition.
*/
export class LineChart {
    public labels: any = [];
    public datasets: any = [];
    public series: any = [];
    public options: any;

    constructor(){
        this.addDataset();
        this.options = {
            responsive: true,
            maintainAspectRatio: false
        };
    }

    public setLabels(labels:string[]){
        this.labels = labels;
    }
      
    public setSeries(value:string[]){
        this.series = value;
    }

    public setValues(value: number[][], labels: string[], colors: string[] = null){
        value.forEach((element, index) => {
            if(index > 0) {
                this.addDataset();
            }
            this.datasets[index].data = element;
            this.datasets[index].label = labels[index];
            if(colors){
                this.datasets[index].backgroundColor = colors[index];
                this.datasets[index].borderColor = colors[index];
            }
        });
    }

    public setOption(name:string, obj:any){
        this.options[name] = obj;
    }

    public getOptions(){
        return this.options;
    }

    public setRandomColors(){
        this.datasets.forEach((element: any) => {
            let color: string = this.getRandomColor();
            element.backgroundColor = color;
            element.borderColor = color;
        });
    }

    private getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    private addDataset() {
        this.datasets.push({
            label: "",
            data: [],
            backgroundColor: "",
            borderColor: "",
            method: [],
            fill: false,
            pointRadius: 5,
            pointHoverRadius: 8,
            showLine: true 
        });
    }
}