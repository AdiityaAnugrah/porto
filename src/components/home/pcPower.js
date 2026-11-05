export const POWER_TIMINGS = {'shutting-down':1600,booting:2200};
export const requestPower = state => state==='on'?'shutting-down':state==='off'?'booting':state;
export const settlePower = state => state==='shutting-down'?'off':state==='booting'?'on':state;
