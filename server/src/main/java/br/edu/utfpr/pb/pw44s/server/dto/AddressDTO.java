package br.edu.utfpr.pb.pw44s.server.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AddressDTO {

    private Long id;

    @NotNull
    @Size(min = 4, max = 255)
    private String street;

    @Size(min = 1, max = 10)
    private String number;

    @Size(min = 2, max = 255)
    private String neighborhood;

    @NotNull
    @Size(min = 4, max = 255)
    private String city;

    @NotNull
    @Size(min = 2, max = 255)
    private String state;

    @NotNull
    @Size(min = 8, max = 255)
    private String zip;

    @Size(min = 1, max = 255)
    private String complement;

}