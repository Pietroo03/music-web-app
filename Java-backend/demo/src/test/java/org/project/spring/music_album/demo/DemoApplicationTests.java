package org.project.spring.music_album.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.web.servlet.MockMvc;
import org.project.spring.music_album.demo.config.JwtTokenProvider;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;

@SpringBootTest
@AutoConfigureMockMvc
// Verifica che l'app si avvii e che gli endpoint rispettino le regole HTTP e di sicurezza attese.
class DemoApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private JwtTokenProvider jwtTokenProvider;

	@Test
	// Controlla che Spring riesca a costruire il contesto completo senza eccezioni all'avvio.
	void contextLoads() {
	}

	@Test
	// Un catalogo protetto non deve essere leggibile da una richiesta anonima.
	void catalogRequiresAuthentication() throws Exception {
		mockMvc.perform(get("/api/albums"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	// Il browser invia una richiesta OPTIONS preliminare prima di alcune chiamate con header Authorization.
	void browserCanPreflightBearerTokenRequests() throws Exception {
		mockMvc.perform(options("/api/albums")
					.header("Origin", "http://localhost:5173")
					.header("Access-Control-Request-Method", "GET")
					.header("Access-Control-Request-Headers", "authorization"))
				.andExpect(status().isOk())
				.andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
	}

	@Test
	// Verifica che un utente autenticato ma senza ruolo ADMIN non possa modificare il catalogo.
	void catalogChangesRequireAdminAuthority() throws Exception {
		mockMvc.perform(post("/api/albums")
					.with(user("regular-user").authorities(() -> "USER"))
					.contentType(MediaType.APPLICATION_JSON)
					.content("{}"))
				.andExpect(status().isForbidden());
	}

	@Test
	void registrationRequiresAnEmailAddress() throws Exception {
		mockMvc.perform(post("/api/auth/register")
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"username\":\"new-user\",\"password\":\"a-password\"}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void passwordResetEndpointIsPublicAndDoesNotAcceptUnknownTokens() throws Exception {
		mockMvc.perform(post("/api/auth/reset-password")
					.contentType(MediaType.APPLICATION_JSON)
					.content("{\"token\":\"unknown-token\",\"password\":\"a-new-password\"}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void jwtTokenCanBeSignedAndValidated() {
		var user = User.withUsername("test-user")
				.password("unused")
				.authorities("USER")
				.build();

		String token = jwtTokenProvider.generateToken(user);

		org.junit.jupiter.api.Assertions.assertTrue(jwtTokenProvider.validateToken(token));
	}

}
