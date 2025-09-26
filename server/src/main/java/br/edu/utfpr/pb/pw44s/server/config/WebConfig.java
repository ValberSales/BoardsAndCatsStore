package br.edu.utfpr.pb.pw44s.server.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class WebConfig {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
