package br.edu.utfpr.pb.pw44s.server.security;

import br.edu.utfpr.pb.pw44s.server.model.User;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TokenService {

    public String generateToken(User user) {
        // Usando as constantes que já devem existir no seu SecurityConstants
        return JWT.create()
                .withSubject(user.getUsername()) // O email é o subject
                .withClaim("id", user.getId())
                .withClaim("displayName", user.getDisplayName())
                // Adicione outras claims se necessário
                .withExpiresAt(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
                .sign(Algorithm.HMAC512(SecurityConstants.SECRET.getBytes()));
    }
}