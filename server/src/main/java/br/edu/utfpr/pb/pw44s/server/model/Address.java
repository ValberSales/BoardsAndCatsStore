package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tb_address")
public class Address {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 4, max = 255)
    private String street;

    @NotNull
    @Size(min = 4, max = 255)
    private String city;

    @NotNull
    @Size(min = 4, max = 255)
    private String state;

    @NotNull
    @Size(min = 4, max = 255)
    private String zip;

    @Size(min = 4, max = 255)
    private String complement;

    @ManyToOne
    private User user;

}
