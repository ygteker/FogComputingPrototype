FROM eclipse-mosquitto:2.0
EXPOSE 1883
COPY mosquitto.conf /mosquitto/config/mosquitto.conf
ENTRYPOINT ["/usr/sbin/mosquitto"]
CMD ["-c", "/mosquitto/config/mosquitto.conf"]