import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import html from 'rollup-plugin-fill-html'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
    input: 'src/main.js',
    output: {
        file: 'public/bundle.js',
        format: 'cjs',
    },
    plugins: [
        html({
            template: 'src/index.html',
            filename: 'index.html'
        }),
        nodeResolve({ jsnext: true }),
        commonjs(),
        babel(),
        serve({
            open: false,
            verbose: true,
            contentBase: 'public',
            host: 'localhost',
            port: 10001,
            // https: {
            //     key: fs.readFileSync('/path/to/server.key'),
            //     cert: fs.readFileSync('/path/to/server.crt'),
            //     ca: fs.readFileSync('/path/to/ca.pem')
            // },
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        }),
        livereload()
    ]
}
