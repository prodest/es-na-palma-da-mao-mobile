import { ToastService } from '../../toast/index';
let toastServiceMock = <ToastService><any>{
    error: () => { },
    info: () => { }
};
export { toastServiceMock }