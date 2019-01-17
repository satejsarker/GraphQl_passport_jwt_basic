const graphql = require('graphql');
const _ = require('lodash');



const Book = require('../models/book');
const Author = require('../models/author');



const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID,
    GraphQLInt, GraphQLList, GraphQLNonNull
} = graphql;
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        //nested data qurry 
        author: {
            type: AuthorType,
            resolve(parent, args) {
                //cz only one author for perticular book 

                // return _.find(authors,{id:parent.authorId})

                return Author.findById(parent.authorId);
            }
        }
    })
});
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                //one author can have multiple book 
                return Book.find({ authorId: parent.id });
            }
        }
    })
});
// graphQl schema desgin 


const RoootQury = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {


                //code to get data from db/other surce  
                //like  args:id
                //   return  _.find(books,{id:args.id});
                return Book.findById(args.id);

            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Author.findById(args.id)
            }
        },
        //for all books
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({});
            }
        }
    }
});


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                })
                //after saving the object to mongo we got return the obj so we can return it 
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                return book.save()
            }
        }
    }
})



//export the Qurry to the server 

module.exports = new GraphQLSchema({
    query: RoootQury,
    mutation: Mutation
});