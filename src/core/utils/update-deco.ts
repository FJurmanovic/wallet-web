export default function update(proto: any, key?: string, dir?: any): any {
    const method: Function = dir.value!;
    dir.value = function () {
        const _return = method.apply(this, arguments);
        if (proto.update) proto.update.call(this);
        return _return;
    };
}
