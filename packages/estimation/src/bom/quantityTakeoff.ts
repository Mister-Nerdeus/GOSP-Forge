export function quantityTakeoff(lines:Array<{id:string;quantity:number}>):Record<string,number>{return Object.fromEntries([...lines].sort((a,b)=>a.id.localeCompare(b.id)).map(l=>[l.id,l.quantity]));}
