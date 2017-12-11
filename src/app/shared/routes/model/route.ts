export interface Route {
    name: string;
    url: string;
    type: string;
    src: string;
    menu: boolean;
    menuName: string;
    icon: string;
    group: string;
    groupMenu: boolean;
    editable: boolean;
    secure: boolean;
    deepLink: boolean;
    package: string;
    uriScheme: string;
}