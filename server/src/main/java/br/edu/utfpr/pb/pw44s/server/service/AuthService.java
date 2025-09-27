package br.edu.utfpr.pb.pw44s.server.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {

    private final IUserService userService;

    public AuthService(IUserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //A lógica de busca foi movida para o UserService, onde deveria estar.
        return userService.loadUserByUsername(username);
    }
}