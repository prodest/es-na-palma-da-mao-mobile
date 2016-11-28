import { DialogService } from '../../dialog/index';

let dialogServiceMock = <DialogService><any>{
    confirm: () => { }
};

export { dialogServiceMock }
