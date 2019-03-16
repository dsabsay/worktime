test:
	node --experimental-modules --loader ./tests/es6-loader.mjs ./tests/elementary.test.mjs && \
		node --experimental-modules --loader ./tests/es6-loader.mjs ./tests/cake.test.mjs
