function check_trait(trait_types, trait) {
    for (var i = 0; i < trait_types['attributes'].length; i++) {
        if (trait_types['attributes'][i]['trait_type'] == trait) {
            return true;
        }
    }
    return false;
}

module.exports = check_trait;