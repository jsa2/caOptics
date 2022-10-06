function unPopulated(item, insertion) {

    if (Array.isArray(item)) {

        item.forEach(sub => {
            unPopulated(sub, insertion)
        })

    } else {

        if (item?.subItems.length > 0) {

            let md = []
            insertion.forEach(insertion => {
                md.push(insertion)
            })

            if (!item?.subItems.includes(md[0])) {
                unPopulated(item.subItems, insertion)
            } else {
                return;
            }

        }

        if (item?.subItems.length == 0) {
            item.subItems = insertion
        }

    }

    return item

}



module.exports = unPopulated