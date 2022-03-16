import {FormGroup} from "@angular/forms";

export const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const mustMatch = (field1: string, field2: string) => {
    return (formGroup: FormGroup) => {
        const control1 = formGroup.get(field1);
        const control2 = formGroup.get(field2);
        control2.setErrors(control1.value === control2.value ? null : {notSame: true});
        return control1.value === control2.value ? null : {notSame: true};
    }
};
