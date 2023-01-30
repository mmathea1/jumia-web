export interface User {
    id: {
        name: string,
        value: string
    };
    email: string;
    name: {
        title: string,
        first: string,
        last: string
    };
    location: {
        street: {
            number: string,
            name: string
        },
        city: string,
        state: string,
        country: string,
        postcode: string,
        coordinates: {
            latitude: string,
            longitude: string
        },
        timezone: {
            offset: string,
            description: string
        }
    };
    picture: {
        large: string,
        medium: string,
        thumbnail: string
    };
    gender: string;
    dob: {
        date: string,
        age: number
    };
    registered: {
        date: string,
        age: number
    };
    phone: string;
    nat: string;
}

export interface UserFilter {
    name: string;
    options: string[];
    defaultValue: string;
}