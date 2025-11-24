package br.edu.utfpr.pb.pw44s.server.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @Column(nullable = false)
    private String street;

    @Size(min = 1, max = 10)
    private String number;

    @Size(min = 4, max = 255)
    private String neighborhood;

    @NotNull
    @Size(min = 4, max = 255)
    @Column(nullable = false)
    private String city;

    @NotNull
    @Size(min = 2, max = 255)
    @Column(nullable = false)
    private String state;

    @NotNull
    @Size(min = 4, max = 255)
    @Column(nullable = false)
    private String zip;

    @Size(max = 255)
    private String complement;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
