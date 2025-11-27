package br.edu.utfpr.pb.pw44s.server.service;

import br.edu.utfpr.pb.pw44s.server.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface IUserService extends ICrudService<User, Long>, UserDetailsService {

    void changePassword(User user, String currentPassword, String newPassword);
    void deleteMe(String password);
}