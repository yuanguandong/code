import React from "react";

export function hijackHoc<T extends { new (...args: any[]): any }>(
    component: T
) {
    return class extends component {
        handleClick() {
            console.log(super.handleClick);
            // 劫持onClick
            super.handleClick();
            alert("handleClick被我劫持啦！！");
        }

        render() {
            const parent = super.render();

            // 劫持render
            return (
                <div style={{ backgroundColor: "green" }}>你已经不再是你</div>
            );
            // // 劫持onClick
            // return React.cloneElement(parent, {
            //     onClick: () => this.handleClick(),
            // });
        }
    };
}
