package org.project.spring.music_album.demo.security;

import java.util.HashSet;
import java.util.Set;

import org.project.spring.music_album.demo.model.Role;
import org.project.spring.music_album.demo.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class DatabaseUserDetails implements UserDetails {

    private final Integer id;
    private final String username;
    private final String password;
    private final boolean enabled;
    private final int tokenVersion;
    private final Set<GrantedAuthority> authorities;

    public DatabaseUserDetails(User user) {
        // Adatta il modello JPA User all'interfaccia standard richiesta da Spring Security.
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.enabled = Boolean.TRUE.equals(user.getEmailVerified());
        this.tokenVersion = user.getTokenVersion() == null ? 0 : user.getTokenVersion();
        this.authorities = new HashSet<GrantedAuthority>();

        for (Role userRole : user.getRoles()) {
            authorities.add(new SimpleGrantedAuthority(userRole.getNome()));
        }

    }

    public Integer getId() {
        return this.id;
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    public Set<GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public int getTokenVersion() {
        return tokenVersion;
    }
}
