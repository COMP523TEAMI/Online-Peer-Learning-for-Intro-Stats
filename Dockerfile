FROM convergencelabs/convergence-omnibus
CMD HTTP_PORT=$PORT ./boot.sh
# CMD /bin/bash