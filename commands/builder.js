/**
 * Check
 * https://segment.com/blog/building-technical-documentation-with-metalsmith/
 * https://www.sitepoint.com/create-static-site-metalsmith/
 * https://www.sitepoint.com/7-reasons-use-static-site-generator/
 * https://github.com/metalsmith/awesome-metalsmith
 */
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var permalinks = require('metalsmith-permalinks');
var inplace = require('metalsmith-in-place');
var headings = require('metalsmith-headings');
var writemetadata = require('metalsmith-writemetadata');
var collections = require('metalsmith-collections');
var debug = require('metalsmith-debug');
var highlighter = require('highlighter');
var template = require('metalsmith-reactjs');
var tags = require('metalsmith-tags');
var partial = require('metalsmith-partial');
var assets = require('metalsmith-assets');
var paths = require('metalsmith-paths')
var lunr = require('metalsmith-lunr');
var lunr_ = require('lunr');
var Q = require('q');



function build() {
    var deferred = Q.defer();

    try {



        Metalsmith(__dirname)
            .metadata({
                title: "365Admin",
                description: "A collection of guides and designs.",
                generator: "Metalsmith",
                url: "http://365admin.net"
            })
            .use(debug())
            .source('../docs')
            .destination('../_build')
            .clean(true)

            // .use(inplace({engine: 'handlebars',
            //     pattern: '**/*.md'
            // }))
            .use(markdown({
                breaks: false,
                pedantic: false,
                sanitize: true,
                smartypants: true,
                gfm: true,
                tables: true,
                highlight: highlighter()
            }))
            .use(paths({
                property: "paths"
            }))
            .use(collections({
                // Designs: {
                //     pattern: 'designs/**/*.html',
                //     sortBy: 'title',
                //     metadata: {
                //         name: 'Designs',
                //         description: 'The Articles listed here...'
                //     }
                // },
                // Guides: {
                //     pattern: 'guides/**/*.html',
                //     sortBy: 'title',
                //     metadata: {
                //         name: 'Guides',
                //         description: 'The Articles listed here...'
                //     }
                // },
                // Policies: {
                //     pattern: 'policies/**/*.html',
                //     sortBy: 'title',
                //     metadata: {
                //         name: 'Policies',
                //         description: 'The Articles listed here...'
                //     }
                // },
                Help: {
                    pattern: 'help/**/*.html',
                    sortBy: 'title',
                    metadata: {
                        name: 'Help',
                        description: 'The Articles listed here...'
                    }
                }
            }))
            .use(permalinks())
            .use(tags({
                // yaml key for tag list in you pages
                handle: 'tags',
                // path for result pages
                path: 'topics/:tag.html',
                // layout to use for tag listing
                layout: '../layouts/tags.html',
                // Can also use `template` property for use with the (deprecated)
                // metalsmith-templates plugin. The `template` property is deprecated here
                // as well but still available for use.
                // template:'/partials/tag.hbt',
                // provide posts sorted by 'date' (optional)
                sortBy: 'date',
                // sort direction (optional)
                reverse: true,
                // skip updating metalsmith's metadata object.
                // useful for improving performance on large blogs
                // (optional)
                skipMetadata: false,
                // Any options you want to pass to the [slug](https://github.com/dodo/node-slug) package.
                // Can also supply a custom slug function.
                // slug: function(tag) { return tag.toLowerCase() }
                slug: { mode: 'rfc3986' }
            }))
            .use(headings('h2'))
            .use(layouts({
                engine: 'handlebars',
                directory: '../layouts',
                partials: '../partials',
                default: '../layouts/index.html',
                pattern: '**/*.html',
            }))
            .use(writemetadata({
                pattern: '**/*.html',
                ignorekeys: ['next', 'previous', 'contents'],
                bufferencoding: false
            }))

            .build(function (err, files) {
                if (err) {
                    return deferred.reject(err);
                }
                deferred.resolve(files);
            });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
    return deferred.promise;
}

exports.build = build;