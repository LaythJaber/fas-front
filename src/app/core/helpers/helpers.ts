import * as objectPath from 'object-path';

export class Helpers {
    /**
     * Filter array by string
     */
    public static filterArrayByString(mainArr, searchText, allowedTargets?: any[], disabledTargets?: any[]): any {
        if ( searchText === '' ) {
            return mainArr;
        }

        searchText = searchText.toLowerCase();

        return mainArr.filter(itemObj => {
            if (allowedTargets && allowedTargets.length) {
                // search in certain properties
                for ( const target of allowedTargets ) {
                    const item = objectPath.get(itemObj, target);
                    if (item) {
                        const result = this.searchInObj({data: item}, searchText);
                        if ( result ) { return true; }
                    } else {
                        continue;
                    }
                }
                return false;
            } else if (disabledTargets && disabledTargets.length) {
                // exclude some properties from the search
                for ( const target of disabledTargets ) {
                    objectPath.empty(itemObj, target);
                }

                return this.searchInObj(itemObj, searchText);
            } else {
                // search in all properties
                return this.searchInObj(itemObj, searchText);
            }
        });
    }

    /**
     * Search in object
     */
    public static searchInObj(itemObj, searchText): boolean {
        for ( const prop in itemObj ) {
            if ( !itemObj.hasOwnProperty(prop) ) {
                continue;
            }

            const value = itemObj[prop];

            if ( typeof value === 'string' ) {
                if ( this.searchInString(value, searchText) ) {
                    return true;
                }
            } else if ( Array.isArray(value) ) {
                if ( this.searchInArray(value, searchText) ) {
                    return true;
                }
            }

            if ( typeof value === 'object' ) {
                if ( this.searchInObj(value, searchText) ) {
                    return true;
                }
            }
        }
    }

    /**
     * Search in array
     */
    public static searchInArray(arr, searchText): boolean {
        for ( const value of arr ) {
            if ( typeof value === 'string' ) {
                if ( this.searchInString(value, searchText) ) {
                    return true;
                }
            }

            if ( typeof value === 'object' ) {
                if ( this.searchInObj(value, searchText) ) {
                    return true;
                }
            }
        }
    }

    /**
     * Search in string
     */
    public static searchInString(value, searchText): any {
        return value.toLowerCase().includes(searchText);
    }

}
