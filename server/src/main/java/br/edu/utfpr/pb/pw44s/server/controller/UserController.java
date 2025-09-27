package br.edu.utfpr.pb.pw44s.server.controller;

import br.edu.utfpr.pb.pw44s.server.error.ApiError;
import br.edu.utfpr.pb.pw44s.server.model.User;
// MUDANÇA 1: Import da interface em vez da classe de serviço antiga
import br.edu.utfpr.pb.pw44s.server.service.IUserService;
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

    // MUDANÇA 2: O tipo do campo agora é a interface
    private final IUserService userService;

    // MUDANÇA 3: O construtor agora recebe a interface
    public UserController(IUserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public void createUser(@Valid @RequestBody User user) {
        // Nenhuma mudança aqui, o método 'save' existe na interface.
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