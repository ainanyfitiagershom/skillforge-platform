package com.tsarajoro.skillforge.sandbox.config;

import com.github.dockerjava.api.DockerClient;
import com.github.dockerjava.core.DefaultDockerClientConfig;
import com.github.dockerjava.core.DockerClientImpl;
import com.github.dockerjava.httpclient5.ApacheDockerHttpClient;
import com.github.dockerjava.transport.DockerHttpClient;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

/**
 * Bean DockerClient partage par tout le service sandbox.
 *
 * Cree un client connecte au daemon Docker local via le socket Unix par defaut.
 * Le pool est dimensionne pour supporter ~20 executions concurrentes (cible POC 3).
 */
@Configuration
@EnableConfigurationProperties(SandboxProperties.class)
public class DockerConfig {

    @Bean
    public DockerClient dockerClient(SandboxProperties props) {
        DefaultDockerClientConfig config = DefaultDockerClientConfig.createDefaultConfigBuilder()
                .withDockerHost(props.dockerHost())
                .build();

        DockerHttpClient http = new ApacheDockerHttpClient.Builder()
                .dockerHost(config.getDockerHost())
                .sslConfig(config.getSSLConfig())
                .maxConnections(30)
                .connectionTimeout(Duration.ofSeconds(5))
                .responseTimeout(Duration.ofSeconds(45))
                .build();

        return DockerClientImpl.getInstance(config, http);
    }
}
