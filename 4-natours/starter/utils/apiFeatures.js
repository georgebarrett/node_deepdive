class APIFeatures {
    // this function gets automatically called when a new object is created
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // {...} = js spread operator. creating a new object from the properties of req.query
        // queryObject has the same properties as this.query
        // spread operators are used to modify an object but preserve the original. this allows for experiments
        const queryObject = {...this.queryString};
        // these are url params that I want to exclude from this.queryString
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        // this is the process for excluding the params
        excludedFields.forEach(element => delete queryObject[element]);

        // 2. ADVANCED FILTERING

        // this variable can be redfined - JSON.stringify converts the queryObject to a JSON string
        let queryString = JSON.stringify(queryObject);
        // queryString is redifined - the replace functions adds a $ to the maths queries
        // the 'g' ensures the $ is added to all the occurrences. not just the first occurence 
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        
        // JSON.parse coverts the json string back into a javascript object
        this.query = this.query.find(JSON.parse(queryString));
        // 'this' refers to the entire object
        return this;
    }

    sort() {
        // the if statement checks to see if sort is included in the url
        if (this.queryString.sort) {
            // this creates a new sorting method where multiple sorting fields can be chained together
            const sortBy = this.queryString.sort.split(',').join(' ');
            // this modifies the existing query pattern to include a sorting method
            this.query = this.query.sort(sortBy);
        } else {
            // creating a default sorting method (descending order)
            this.query = this.query.sort('-createdAt');
        }
        // 'this' refers to the entire object
        return this;
    }

    limitFields() {
        // the if checks to see if there are fields in the url eg ?fields=name,description
        if (this.queryString.fields) {
            // this converts the firelds sinto an array of strings and then into a string with space separations
            // mongoose likes this format
            const fields = this.queryString.fields.split(',').join(' ');
            // this modifies the existing mongoose query so that it only includes the fields that are defined
            this.query = this.query.select(fields);
        } else {
            // by default i am only excluding the __v field (this is a special field for mongoose) -means exclude
            this.query = this.query.select('-__v')
        }
        return this;
    }

    paginate() {
        // * 1 this will convert the string into an integer. queries are by default strings
        // the || 1 means the page number will default to 1  
        const page = this.queryString.page * 1 || 1;
        // * 1 converts the limit to an integer || sets default result limit to 100 
        const limit = this.queryString.limit * 1 || 100;
        // page - 1 is the previous page. multiplying the previous page by the result limit gives the total number of items to skip
        // if page is 3 and limit is 10 (3 - 1) * 10 = 20 so the query should skip the first 20 items  
        const skip = (page - 1) * limit;

        // limit is the amount of results that we want 
        // skip is the amount of results that should be skipped before the data gets queried
        // page=3&limit=10, 1-10 - page 1, 11-20 - page-2, 21-30 - page-3
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;