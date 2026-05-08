export function laborEstimate(...minutes:number[]):number{return minutes.reduce((sum,value)=>sum+value,0);}
