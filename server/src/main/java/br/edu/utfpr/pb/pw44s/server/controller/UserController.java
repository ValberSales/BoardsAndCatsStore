package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.error.ApiError;
import br.edu.utfpr.pb.pw44s.server.model.User;
import br.edu.utfpr.pb.pw44s.server.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public void createUser(@Valid @RequestBody User user) {
        this.userService.save( user );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiError handleException(MethodArgumentNotValidException exception,
                                    HttpServletRequest request) {

        BindingResult result = exception.getBindingResult();
        Map<String, String> errors = new HashMap<>();
        for (FieldError fieldError : result.getFieldErrors()) {
            errors.put( fieldError.getField(), 
                        fieldError.getDefaultMessage());
        }

        return new ApiError("Validation error.",
                            HttpStatus.BAD_REQUEST.value(),
                            request.getServletPath(),
                            errors);
    }
}
