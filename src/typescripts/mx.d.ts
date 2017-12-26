

declare namespace mx {

    namespace views {
        class ViewController {

        }
    }

    namespace weblets {

        interface Weblet {
            id: string,
            name: string,
            requires: string[],
            onload: (e: any) => void,
            onstart: (e: any) => void
        }

        class WebletManager {
            static register(weblet: Weblet): void;
        }
    }
}

declare function $ns(n: string): void;
declare function $extend(b: any): void;
declare function $import(n: string): void;