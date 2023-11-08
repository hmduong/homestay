const validator = (form, rules, except) => {
    const rulesName = Object.keys(rules);
    const formName = Object.keys(form);
    const cookedRules = Object.values(rules).map((rule, index) => ({
        name: rulesName[index],
        filter: rule
    }))
    const result = {}
    const values = Object.values(form);
    values.forEach((value, index) => {
        cookedRules.every((rule) => {
            let valueErr
            let isExcept = except[formName[index]] ? except[formName[index]].includes(rule.name) : false
            if (!isExcept) {
                const mess = rule.filter(value);
                valueErr = mess;
            }
            if (valueErr) {
                result[formName[index]] = valueErr;
                return
            } else return true;
        });
    })
    if (Object.values(result).length > 0) return result;
    return null;
}

export default validator